import { hasAdminPermission, requireAdminSession } from "@/lib/admin/data";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

type Ashram = { id: string; slug: string; name_gu: string };
type Stay = {
  id: string;
  request_number: string;
  applicant_name: string;
  mobile: string;
  native_village: string;
  full_address: string;
  ashram_id: string;
  check_in: string;
  check_out: string;
  total_members: number;
  status: string;
  breakfast_count: number;
  lunch_count: number;
  dinner_count: number;
};
type Assignment = { id: string; stay_request_id: string; room_id: string; released_at: string | null };
type Room = { id: string; ashram_id: string; room_number: string; capacity: number };
type Meal = { stay_request_id: string; meal_date: string; breakfast_count: number; lunch_count: number; dinner_count: number };
type Membership = {
  application_number: string;
  first_name: string;
  father_name: string | null;
  surname: string | null;
  mobile: string;
  native_village: string;
  full_address: string;
  education: string | null;
  occupation: string | null;
  blood_group: string | null;
  gender: string;
  age: number;
  family_member_count: number;
  status: string;
  submitted_at: string;
};
type Volunteer = {
  application_number: string;
  full_name: string;
  mobile: string;
  full_address: string;
  age: number | null;
  available_from: string | null;
  available_until: string | null;
  time_slot: string | null;
  preferred_ashram_id: string | null;
  preferred_seva: string[] | null;
  skills: string | null;
  status: string;
  submitted_at: string;
};
type VedaSubscriber = {
  subscriber_number: string;
  full_name: string;
  mobile: string;
  village: string | null;
  full_address: string;
  pincode: string;
  status: string;
  started_at: string;
  ended_at: string | null;
};
type Cash = {
  id: string;
  reference_type: string;
  reference_id: string | null;
  payer_name: string;
  mobile: string | null;
  amount: number | string;
  purpose_gu: string;
  ashram_id: string | null;
  received_at: string;
  note: string | null;
  voided_at: string | null;
};
type Receipt = { cash_transaction_id: string; receipt_number: string; status: string; issued_at: string };

const formulaPrefix = /^[\t\r\n ]*[=+\-@]/;
const PAGE_SIZE = 1000;
const MAX_EXPORT_SOURCE_ROWS = 100_000;

function csvCell(value: unknown) {
  let text = value == null ? "" : Array.isArray(value) ? value.join(" | ") : String(value);
  if (formulaPrefix.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function csv(headers: string[], rows: unknown[][]) {
  return "\ufeff" + [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

function inRange(value: string | null, from: string, to: string) {
  if (!value) return true;
  const day = value.slice(0, 10);
  return (!from || day >= from) && (!to || day <= to);
}

// Stay dates are [check_in, check_out): checkout day is not an occupied night.
// The report's `to` filter is inclusive.
function stayOverlapsRange(checkIn: string, checkOut: string, from: string, to: string) {
  return (!from || checkOut > from) && (!to || checkIn <= to);
}

async function fetchAll<T>(query: string, token: string): Promise<T[]> {
  const rows: T[] = [];
  while (true) {
    const separator = query.includes("?") ? "&" : "?";
    const page = await supabaseRest<T[]>(
      `${query}${separator}limit=${PAGE_SIZE}&offset=${rows.length}`,
      token,
    );
    if (!page.length) return rows;
    rows.push(...page);
    if (rows.length > MAX_EXPORT_SOURCE_ROWS) {
      throw new Error("Export source is too large; narrow the requested report range");
    }
    if (page.length < PAGE_SIZE) return rows;
  }
}

function filename(type: string) {
  return `pim-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
}

function download(type: string, headers: string[], rows: unknown[][]) {
  return new Response(csv(headers, rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename(type)}"`,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

function denied() {
  return Response.json({ error: "Export permission denied" }, { status: 403 });
}

export async function GET(request: Request) {
  const session = await requireAdminSession();
  if (!hasAdminPermission(session, "exports.run")) return denied();

  const token = await getAdminAccessToken();
  if (!token) return denied();

  const url = new URL(request.url);
  const type = url.searchParams.get("type") ?? "stays";
  const from = url.searchParams.get("from") ?? "";
  const to = url.searchParams.get("to") ?? "";
  const ashramSlug = url.searchParams.get("ashram") ?? "";
  const status = url.searchParams.get("status") ?? "";

  if (from && to && from > to) {
    return Response.json({ error: "Invalid date range" }, { status: 400 });
  }

  const ashrams = await fetchAll<Ashram>(
    "ashram_profiles?select=id,slug,name_gu&archived_at=is.null&order=name_gu.asc",
    token,
  );
  const ashramById = new Map(ashrams.map((ashram) => [ashram.id, ashram]));
  const requestedAshram = ashrams.find((ashram) => ashram.slug === ashramSlug);
  const matchesAshram = (id: string | null) => !ashramSlug || Boolean(requestedAshram && id === requestedAshram.id);

  if (["stays", "kitchen", "rooms"].includes(type)) {
    if (!hasAdminPermission(session, "stays.view")) return denied();

    const stays = await fetchAll<Stay>(
      "stay_requests?select=id,request_number,applicant_name,mobile,native_village,full_address,ashram_id,check_in,check_out,total_members,status,breakfast_count,lunch_count,dinner_count&order=check_in.asc",
      token,
    );
    const scopedStays = stays.filter(
      (stay) => matchesAshram(stay.ashram_id) && (!status || stay.status === status),
    );

    if (type === "stays") {
      const filtered = scopedStays.filter((stay) => stayOverlapsRange(stay.check_in, stay.check_out, from, to));
      const [assignments, rooms] = await Promise.all([
        fetchAll<Assignment>("room_assignments?select=id,stay_request_id,room_id,released_at", token),
        fetchAll<Room>("rooms?select=id,ashram_id,room_number,capacity", token),
      ]);
      const roomById = new Map(rooms.map((room) => [room.id, room]));
      const roomFor = new Map(
        assignments
          .filter((assignment) => !assignment.released_at)
          .map((assignment) => [assignment.stay_request_id, roomById.get(assignment.room_id)?.room_number ?? ""]),
      );

      return download(
        "pilgrim-stays",
        ["Request No", "Ashram", "Applicant", "Mobile", "Native Village", "Address", "Check In", "Check Out", "Members", "Status", "Room", "Breakfast", "Lunch", "Dinner"],
        filtered.map((stay) => [
          stay.request_number,
          ashramById.get(stay.ashram_id)?.name_gu ?? "",
          stay.applicant_name,
          stay.mobile,
          stay.native_village,
          stay.full_address,
          stay.check_in,
          stay.check_out,
          stay.total_members,
          stay.status,
          roomFor.get(stay.id) ?? "",
          stay.breakfast_count,
          stay.lunch_count,
          stay.dinner_count,
        ]),
      );
    }

    if (type === "kitchen") {
      // A stay may begin before `from` while still requiring meals inside the
      // selected meal-date range, so only meal_date is range-filtered here.
      const stayById = new Map(scopedStays.map((stay) => [stay.id, stay]));
      const meals = await fetchAll<Meal>(
        "stay_meal_requirements?select=stay_request_id,meal_date,breakfast_count,lunch_count,dinner_count&order=meal_date.asc",
        token,
      );
      const operationalStatuses = new Set(["approved", "room_assigned", "checked_in"]);
      const totals = new Map<string, { date: string; ashram: string; breakfast: number; lunch: number; dinner: number }>();

      for (const meal of meals) {
        const stay = stayById.get(meal.stay_request_id);
        if (!stay || !operationalStatuses.has(stay.status) || !inRange(meal.meal_date, from, to)) continue;
        const ashram = ashramById.get(stay.ashram_id);
        if (!ashram) continue;
        const key = `${meal.meal_date}|${ashram.id}`;
        const row = totals.get(key) ?? { date: meal.meal_date, ashram: ashram.name_gu, breakfast: 0, lunch: 0, dinner: 0 };
        row.breakfast += meal.breakfast_count;
        row.lunch += meal.lunch_count;
        row.dinner += meal.dinner_count;
        totals.set(key, row);
      }

      return download(
        "kitchen-headcount",
        ["Date", "Ashram", "Breakfast", "Lunch", "Dinner"],
        [...totals.values()]
          .sort((a, b) => a.date.localeCompare(b.date) || a.ashram.localeCompare(b.ashram))
          .map((row) => [row.date, row.ashram, row.breakfast, row.lunch, row.dinner]),
      );
    }

    const overlappingStayById = new Map(
      scopedStays
        .filter((stay) => stayOverlapsRange(stay.check_in, stay.check_out, from, to))
        .map((stay) => [stay.id, stay]),
    );
    const [assignments, rooms] = await Promise.all([
      fetchAll<Assignment>(
        "room_assignments?select=id,stay_request_id,room_id,released_at&released_at=is.null",
        token,
      ),
      fetchAll<Room>("rooms?select=id,ashram_id,room_number,capacity", token),
    ]);
    const roomById = new Map(rooms.map((room) => [room.id, room]));

    return download(
      "room-occupancy",
      ["Ashram", "Room", "Capacity", "Request No", "Applicant", "Check In", "Check Out", "Members", "Status"],
      assignments.flatMap((assignment) => {
        const stay = overlappingStayById.get(assignment.stay_request_id);
        const room = roomById.get(assignment.room_id);
        if (!stay || !room) return [];
        return [[
          ashramById.get(stay.ashram_id)?.name_gu ?? "",
          room.room_number,
          room.capacity,
          stay.request_number,
          stay.applicant_name,
          stay.check_in,
          stay.check_out,
          stay.total_members,
          stay.status,
        ]];
      }),
    );
  }

  if (type === "members") {
    if (!hasAdminPermission(session, "membership.view")) return denied();
    const rows = await fetchAll<Membership>(
      "membership_applications?select=application_number,first_name,father_name,surname,mobile,native_village,full_address,education,occupation,blood_group,gender,age,family_member_count,status,submitted_at&order=submitted_at.desc",
      token,
    );
    const filtered = rows.filter((row) => (!status || row.status === status) && inRange(row.submitted_at, from, to));
    return download(
      "membership-applications",
      ["Application No", "Name", "Father Name", "Surname", "Mobile", "Native Village", "Address", "Education", "Occupation", "Blood Group", "Gender", "Age", "Family Members", "Status", "Submitted"],
      filtered.map((row) => [row.application_number, row.first_name, row.father_name, row.surname, row.mobile, row.native_village, row.full_address, row.education, row.occupation, row.blood_group, row.gender, row.age, row.family_member_count, row.status, row.submitted_at]),
    );
  }

  if (type === "volunteers") {
    if (!hasAdminPermission(session, "volunteer.view")) return denied();
    const rows = await fetchAll<Volunteer>(
      "volunteer_applications?select=application_number,full_name,mobile,full_address,age,available_from,available_until,time_slot,preferred_ashram_id,preferred_seva,skills,status,submitted_at&order=submitted_at.desc",
      token,
    );
    const filtered = rows.filter(
      (row) => matchesAshram(row.preferred_ashram_id) && (!status || row.status === status) && inRange(row.submitted_at, from, to),
    );
    return download(
      "volunteers",
      ["Application No", "Name", "Mobile", "Address", "Age", "Available From", "Available Until", "Time Slot", "Ashram", "Preferred Seva", "Skills", "Status", "Submitted"],
      filtered.map((row) => [
        row.application_number,
        row.full_name,
        row.mobile,
        row.full_address,
        row.age,
        row.available_from,
        row.available_until,
        row.time_slot,
        row.preferred_ashram_id ? ashramById.get(row.preferred_ashram_id)?.name_gu ?? "" : "",
        row.preferred_seva,
        row.skills,
        row.status,
        row.submitted_at,
      ]),
    );
  }

  if (type === "veda") {
    if (!hasAdminPermission(session, "veda.view")) return denied();
    const rows = await fetchAll<VedaSubscriber>(
      "veda_subscribers?select=subscriber_number,full_name,mobile,village,full_address,pincode,status,started_at,ended_at&order=created_at.desc",
      token,
    );
    return download(
      "veda-subscribers",
      ["Subscriber No", "Name", "Mobile", "Village", "Address", "PIN Code", "Status", "Started", "Ended"],
      rows
        .filter((row) => (!status || row.status === status) && inRange(row.started_at, from, to))
        .map((row) => [row.subscriber_number, row.full_name, row.mobile, row.village, row.full_address, row.pincode, row.status, row.started_at, row.ended_at]),
    );
  }

  if (type === "cash") {
    if (!hasAdminPermission(session, "cash.record") && !hasAdminPermission(session, "receipts.issue")) return denied();
    const [rows, receipts] = await Promise.all([
      fetchAll<Cash>(
        "cash_transactions?select=id,reference_type,reference_id,payer_name,mobile,amount,purpose_gu,ashram_id,received_at,note,voided_at&order=received_at.desc",
        token,
      ),
      fetchAll<Receipt>("receipts?select=cash_transaction_id,receipt_number,status,issued_at", token),
    ]);
    const receiptByCash = new Map(receipts.map((receipt) => [receipt.cash_transaction_id, receipt]));
    const filtered = rows.filter((row) => matchesAshram(row.ashram_id) && inRange(row.received_at, from, to));
    return download(
      "cash-receipts",
      ["Received Date", "Ashram", "Payer", "Mobile", "Amount", "Purpose", "Reference Type", "Reference ID", "Receipt No", "Receipt Status", "Note", "Voided"],
      filtered.map((row) => {
        const receipt = receiptByCash.get(row.id);
        return [
          row.received_at,
          row.ashram_id ? ashramById.get(row.ashram_id)?.name_gu ?? "" : "Global",
          row.payer_name,
          row.mobile,
          row.amount,
          row.purpose_gu,
          row.reference_type,
          row.reference_id,
          receipt?.receipt_number ?? "",
          receipt?.status ?? "",
          row.note,
          row.voided_at ? "Yes" : "No",
        ];
      }),
    );
  }

  return Response.json({ error: "Unknown export type" }, { status: 400 });
}

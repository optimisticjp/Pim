"use server";

import { redirect } from "next/navigation";

import { submitPublicForm } from "@/lib/public-form-gateway";

function text(formData: FormData, name: string, max = 500): string | null {
  const value = String(formData.get(name) ?? "").trim();
  return value ? value.slice(0, max) : null;
}

export async function submitMembershipApplicationAction(formData: FormData): Promise<never> {
  if (text(formData, "website", 100)) redirect("/membership?submitted=received");

  const familyMembers = Array.from({ length: 5 }, (_, index) => {
    const firstName = text(formData, `family_${index}_first_name`, 120);
    if (!firstName) return null;
    return {
      relationship: text(formData, `family_${index}_relationship`, 80),
      first_name: firstName,
      father_name: text(formData, `family_${index}_father_name`, 120),
      surname: text(formData, `family_${index}_surname`, 120),
      age: text(formData, `family_${index}_age`, 3),
      gender: text(formData, `family_${index}_gender`, 24),
      education: text(formData, `family_${index}_education`, 160),
      occupation: text(formData, `family_${index}_occupation`, 160),
      mobile: text(formData, `family_${index}_mobile`, 24),
      blood_group: text(formData, `family_${index}_blood_group`, 8),
      native_village: text(formData, `family_${index}_native_village`, 160),
    };
  }).filter(Boolean);

  const payload = {
    first_name: text(formData, "first_name", 120),
    father_name: text(formData, "father_name", 120),
    surname: text(formData, "surname", 120),
    full_address: text(formData, "full_address", 1000),
    education: text(formData, "education", 160),
    mobile: text(formData, "mobile", 24),
    occupation: text(formData, "occupation", 160),
    native_village: text(formData, "native_village", 160),
    blood_group: text(formData, "blood_group", 8),
    gender: text(formData, "gender", 24),
    age: text(formData, "age", 3),
    family_members: familyMembers,
  };

  let applicationNumber = "";
  try {
    const result = await submitPublicForm<Array<{ application_id: string; application_number: string }>>(
      "membership",
      "submit_membership_application",
      payload,
      formData,
    );
    applicationNumber = result[0]?.application_number ?? "";
  } catch {
    redirect("/membership?error=submit");
  }

  redirect(`/membership?submitted=${encodeURIComponent(applicationNumber || "received")}`);
}

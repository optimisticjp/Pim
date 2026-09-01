export const inboxStatusLabels: Record<string, string> = {
  new: "નવી",
  submitted: "પ્રાપ્ત",
  reviewing: "ચકાસણીમાં",
  under_review: "ચકાસણીમાં",
  pending: "બાકી",
  waiting: "પ્રતીક્ષામાં",
  documents_required: "દસ્તાવેજ જરૂરી",
  approved: "મંજૂર",
  accepted: "સ્વીકારેલ",
  active: "સક્રિય",
  assigned: "સોંપેલ",
  confirmed: "પુષ્ટિ",
  completed: "પૂર્ણ",
  published: "પ્રકાશિત",
  cancelled: "રદ",
  rejected: "નામંજૂર",
  archived: "આર્કાઇવ",
  cash_pending: "નકદ બાકી",
  cash_received: "નકદ મળ્યું",
  receipt_issued: "રસીદ જારી",
};

export const inboxCategoryLabels: Record<string, string> = {
  room_booking: "રૂમ બુકિંગ",
  membership: "સભ્યપદ",
  volunteer: "સ્વયંસેવક",
  veda_rahasya: "વેદ રહસ્ય",
  donation: "દાન / ભેટ",
  article_submission: "લેખ મોકલાવેલ",
  address_change: "સરનામું સુધારો",
  inquiry: "પૂછપરછ",
  contact: "સંપર્ક પૂછપરછ",
  participation: "સહભાગિતા / સેવા રસ",
  manual: "આંતરિક નોંધ",
};

export function statusLabel(value: string): string {
  return inboxStatusLabels[value] ?? value;
}

export function categoryLabel(value: string): string {
  return inboxCategoryLabels[value] ?? value;
}

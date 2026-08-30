export const inboxStatusLabels: Record<string, string> = {
  new: "નવી",
  reviewing: "ચકાસણીમાં",
  pending: "બાકી",
  documents_required: "દસ્તાવેજ જરૂરી",
  approved: "મંજૂર",
  assigned: "સોંપેલ",
  completed: "પૂર્ણ",
  cancelled: "રદ",
  rejected: "નામંજૂર",
  cash_pending: "નકદ બાકી",
  cash_received: "નકદ મળ્યું",
  receipt_issued: "રસીદ જારી",
};

export const inboxCategoryLabels: Record<string, string> = {
  room_booking: "રૂમ બુકિંગ",
  membership: "સભ્યપદ",
  volunteer: "સ્વયંસેવક",
  veda_rahasya: "વેદ રહસ્ય",
  article_submission: "લેખ મોકલાવેલ",
  address_change: "સરનામું સુધારો",
  inquiry: "પૂછપરછ",
  manual: "આંતરિક નોંધ",
};

export function statusLabel(value: string): string {
  return inboxStatusLabels[value] ?? value;
}

export function categoryLabel(value: string): string {
  return inboxCategoryLabels[value] ?? value;
}

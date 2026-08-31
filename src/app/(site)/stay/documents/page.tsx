import type { Metadata } from "next";
import { DocumentUploadPage } from "@/app/(site)/stay/documents/document-upload-page";
export const metadata:Metadata={title:"ખાનગી દસ્તાવેજ અપલોડ",robots:{index:false,follow:false}};
export default function StayDocumentsPage(){return <><section className="border-b border-border bg-[#f4eee5]"><div className="container-site py-10 sm:py-14"><p className="eyebrow">આશ્રમ ઉતારા</p><h1 className="display-title mt-3 text-primary">ઓળખ દસ્તાવેજ સુરક્ષિત રીતે મોકલો</h1><p className="body-large mt-4 max-w-3xl">આ પેજ માત્ર આશ્રમ સમિતિ દ્વારા આપવામાં આવેલી સમયબદ્ધ ખાનગી કડીથી કામ કરે છે.</p></div></section><section className="py-10"><div className="container-site max-w-3xl"><DocumentUploadPage/></div></section></>}

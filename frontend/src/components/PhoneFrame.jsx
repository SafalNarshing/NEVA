/**
 * Centers the app in a phone-sized frame on large screens and goes edge-to-edge
 * on real phones. Everything inside scrolls; the frame itself stays put.
 */
export default function PhoneFrame({ children }) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-[#e9e7f4] sm:p-6">
      <div className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-canvas shadow-float sm:h-[880px] sm:max-h-[92dvh] sm:rounded-[2.75rem] sm:ring-8 sm:ring-black/85">
        {children}
      </div>
    </div>
  )
}

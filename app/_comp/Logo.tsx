"use client";
const text = "/BIOSYSLOGO.png";
export function LOGO() {
  return (
    <div className="">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={text} alt="logo" className="max-w-8 aspect-square"/>
    </div>
  );
}

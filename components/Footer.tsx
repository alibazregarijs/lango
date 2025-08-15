import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black-1 text-white-2 py-3 text-center font-sans border-t border-black-5 z-50">
      <p className="m-0 text-sm">
        Application developed by
        <Link href={"https://github.com/alibazregarijs"}>
          <span className="text-orange-1"> alibazregarijs</span>
        </Link>
      </p>
    </footer>
  );
};

export default Footer;

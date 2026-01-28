"use client";

import { usePathname } from "next/navigation";
import css from "../page.module.css";
import { Icon } from "@/components/Icon/Icon";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const showBackground = pathname !== "/sign-in" && pathname !== "/sign-up";

  return (
    <main className={css.mainContainer}>
      <div className={css.wrapper}>
        {/* 4. Використовуємо умовний рендеринг */}
        {showBackground && (
          <div className={css.backgroundphoto}>
            <div className={css.rectangle}>
              <div className={css.svg}>
                <Icon id="icon-arrow-up-right2" className={css.icon} />
              </div>
              <div>
                <p className={css.rectangle_text1}>Your balance</p>
                <p className={css.rectangle_text2}>$632.000</p>
              </div>
              <div className={css.rectangle_block2}>
                <p className={css.rectangle_text3}>+1.29%</p>
              </div>
            </div>
          </div>
        )}

        <div className={css.contentSide}>{children}</div>
      </div>
    </main>
  );
}

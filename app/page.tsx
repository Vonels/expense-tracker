import css from "./page.module.css";
import { Icon } from "@/components/Icon/Icon";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <main>
        <div>
          <div>
            <div>
              <div>
                <Icon />
              </div>
              <div>
                <p>Your balance</p>
                <p>$632.000</p>
              </div>
              <div>
                <p>+1.29%</p>
              </div>
            </div>
          </div>
          <div>
            <p></p>
            <div>
              <p>Manage Your Finances Masterfully!</p>
              <p>
                ExpenseTracker effortlessly empowers you to take control of your
                finances! With intuitive features, it simplifies the process of
                tracking and managing expenses, allowing for a stress-free
                mastery over your financial world.
              </p>
            </div>
            <div>
              <button type="button"></button>
              <button type="button"></button>
            </div>
            <div>
              <Image alt="avatars" src={""} />
              <p></p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

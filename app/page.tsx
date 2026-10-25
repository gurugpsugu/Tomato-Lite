import { redirect } from "next/navigation";

/**
 * The restaurant page is the product's front door now.
 * Nobody lands on "tomato-lite is alive" and wonders what to do next.
 */
export default function Home() {
  redirect("/restaurant/1");
}

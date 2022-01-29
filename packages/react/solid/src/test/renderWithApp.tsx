import { render } from "@testing-library/react";
import { App } from "~/options/solid/src/components";

export function renderWithApp(children: JSX.Element) {
  render(<App>{children}</App>);
}

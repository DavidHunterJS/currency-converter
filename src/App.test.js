import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

describe("the currency converter app", () => {
  // added to remove console logs from polluting test cli
  console.log = () => {};

  it("loads and displays banner 'currency converter'", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByRole("banner")).toHaveTextContent(
        /currency converter/i
      )
    );
  });
  it("has a number input for the amount of currency", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument()
    );
  });
  it("has a From spinner picker for the original currency", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByLabelText(/from/i)).toBeInTheDocument()
    );
  });
});

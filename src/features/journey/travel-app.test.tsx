import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { TravelApp } from "./travel-app";

describe("TravelApp", () => {
  it("offers the three launch games and automatic selection", () => {
    render(<TravelApp />);

    expect(screen.getByRole("button", { name: /지도 다트/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /여행 슬롯/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /행운의 카드/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /게임도 랜덤으로/ })).toBeInTheDocument();
  });

  it("continues from a game to nationwide draw", async () => {
    const user = userEvent.setup();
    render(<TravelApp />);

    await user.click(screen.getByRole("button", { name: /지도 다트/ }));
    expect(screen.getByRole("heading", { name: /어디까지 맡겨볼까요/ })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /전국에서 랜덤/ }));
    expect(screen.getByRole("heading", { name: /시·도를 정해볼까요/ })).toBeInTheDocument();
  });
});

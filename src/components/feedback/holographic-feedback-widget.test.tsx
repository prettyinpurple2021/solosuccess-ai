/**
 * @jest-environment jsdom
 */
"use client"

import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as Sentry from "@sentry/nextjs"

import { FeedbackWidget } from "./feedback-widget"

jest.mock("@sentry/nextjs", () => ({
  captureFeedback: jest.fn(),
}))

describe("FeedbackWidget", () => {
  const originalCreateObjectURL = URL.createObjectURL
  const originalRevokeObjectURL = URL.revokeObjectURL

  beforeEach(() => {
    URL.createObjectURL = jest.fn(() => "blob:mock-url")
    URL.revokeObjectURL = jest.fn()
  })

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
    jest.clearAllMocks()
  })

  it("revokes screenshot blob URL on unmount", async () => {
    const user = userEvent.setup()
    const file = new File(["dummy"], "screenshot.png", { type: "image/png" })

    const { unmount } = render(<FeedbackWidget />)

    await user.click(screen.getByRole("button", { name: /report a bug/i }))
    const fileInput = screen.getByLabelText(/upload a screenshot/i)

    await user.upload(fileInput, file)

    expect(URL.createObjectURL).toHaveBeenCalledWith(file)

    unmount()

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url")
  })
})


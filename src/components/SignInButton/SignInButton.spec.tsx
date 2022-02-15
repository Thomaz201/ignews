import { render, RenderResult } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { mocked } from 'jest-mock'
import { SignInButton } from './'

jest.mock('next-auth/client')

describe('SignInButton component tests', () => {
  const useSessionMocked = mocked(useSession);

  it('should render correctly when user is not authenticated', () => {
    useSessionMocked.mockReturnValueOnce([null, false])

    const documentBody: RenderResult = render(
      <SignInButton />
    )

    const buttonElement = documentBody.getByText('Sign in with Github')

    expect(buttonElement).toBeInTheDocument()
  })

  it('should render correctly when user is authenticated', () => {
    useSessionMocked.mockReturnValueOnce([{
      user: {
        name: 'John Doe',
        email: 'johndoe@example.com'
      },
      expires: 'fake-expires'
    }, false])

    const documentBody: RenderResult = render(
      <SignInButton />
    )

    const buttonElement = documentBody.getByText('John Doe')

    expect(buttonElement).toBeInTheDocument()
  })
})
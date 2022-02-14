import { render, RenderResult } from '@testing-library/react'
import { Header } from './'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false]
    }
  }
})

describe('Header component tests', () => {
  it('should render correctly', () => {
    const documentBody: RenderResult = render(
      <Header />
    )

    const homeAnchorElement = documentBody.getByText('Home')
    const postsAnchorElement = documentBody.getByText('Posts')

    expect(homeAnchorElement).toBeInTheDocument()
    expect(postsAnchorElement).toBeInTheDocument()
  })
})
import { MyPageRemake } from './MyPage.jsx'
import { useOutletContext } from 'react-router-dom'

function MyPageEditPage() {
  const { account, setAccount } = useOutletContext()
  return <MyPageRemake account={account} setAccount={setAccount} />
}

export default MyPageEditPage
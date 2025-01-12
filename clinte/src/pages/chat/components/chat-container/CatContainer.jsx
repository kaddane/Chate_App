
import CateHeader from "./Chate-Header/CateHeader"
import MessageContiner from "./Message-Continer/MessageContiner"
import MessageBare from './Message-Bare/MessageBare'


function CatContainer() {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <CateHeader />
      <MessageContiner />
      <MessageBare />
    </div>
  )
}

export default CatContainer
import './styles.css'
import '../../styles/colors.css'
import '../../styles/fonts.css'
import '../../styles/global.css'

function ButtonDefault({ width, content, height, marginTop, defaultFunction, colorAddEditModal }) {

  if (!height) {
    height = 48
  }

  return (
    <button
      type='button'
      onClick={() => defaultFunction()}
      className={`button-default ${colorAddEditModal}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        marginTop: `${marginTop}px`
      }}>
      {content}
    </button>
  )
}

export default ButtonDefault
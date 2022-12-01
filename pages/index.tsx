import styles from '../styles/Home.module.css'
import TextEditor from './components/TextEditor/TextEditor'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.editorContainer}>
        <TextEditor />
      </div>
    </div>
  )
}

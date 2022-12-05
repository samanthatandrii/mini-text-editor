import Footer from '../components/Footer/Footer';
import TextEditor from '../components/TextEditor/TextEditor';

export default function Home() {
  return (
    <div className="container">
      <div className="editorContainer">
        <TextEditor />
      </div>
      <Footer />
    </div>
  );
}

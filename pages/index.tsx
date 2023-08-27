import Head from 'next/head';
import Footer from '../components/Footer/Footer';
import TextEditor from '../components/TextEditor/TextEditor';

export default function Home() {
  return (
    <main>
      <Head>
        <title>Mini Text Editor - Samantha</title>
      </Head>
      <div className="container">
        <div className="editorContainer">
          <TextEditor />
        </div>
        <Footer />
      </div>
    </main>
  );
}

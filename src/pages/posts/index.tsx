import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Createing Monorepo with Lerna</strong>
            <p>AIushaiduhsa asoidoasi oaisjdao doaioiaso oaisoasj aoisjs oiaas</p>
          </a>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Createing Monorepo with Lerna</strong>
            <p>AIushaiduhsa asoidoasi oaisjdao doaioiaso oaisoasj aoisjs oiaas</p>
          </a>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Createing Monorepo with Lerna</strong>
            <p>AIushaiduhsa asoidoasi oaisjdao doaioiaso oaisoasj aoisjs oiaas</p>
          </a>
        </div>
      </main>
    </>
  );
};
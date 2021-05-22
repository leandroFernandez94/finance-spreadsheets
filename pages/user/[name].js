import Head from "next/head";
import { useRouter } from "next/router";
import Layout, { siteTitle } from "../../components/layout";
import styles from './user.module.scss';
import cn from 'classnames';
import { useState } from "react";

const ENTRY = 'entry'
const EXPENSE = 'expense'

function postNewData(data) {
  return fetch('/api/saveItem', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}



export default function Home() {
  const route = useRouter()
  const name = route.query.name
  const [showIsShared, setShowIsShared] = useState(true);
  const [isShared, setIsShared] = useState(false);


  function handleTypeChange(e) {
    setShowIsShared(e.target.id === EXPENSE)
    setIsShared(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const [
      { value: description },
      { value },
      { checked: isExpense }
    ] = Array.from(e.target.elements)
    const type = isExpense ? EXPENSE : ENTRY

    try {
      await postNewData({
        description,
        value,
        type,
        name,
        ...(type === EXPENSE ? { shared: isShared } : null)
      })
    } catch (e) {
      console.log(e)
    }

  }
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <h1 className={styles.nameHeader}>{name}</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="description">Descripcion:</label>
          <input type="text" id="description" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="value">Valor:</label>
          <input type="number" id="value" required />
        </div>
        <div className={cn(styles.formGroup, styles.inline)}>
          <div>
            <label htmlFor="expense">es gasto</label>
            <input defaultChecked onChange={handleTypeChange} type="radio" id="expense" name="action-type" value="expense"></input>
          </div>
          <div>
            <label htmlFor="entry">es ingreso</label>
            <input onChange={handleTypeChange} type="radio" id="entry" name="action-type" value="entry"></input>
          </div>
        </div>
        {showIsShared && (
          <div className={cn(styles.formGroup, styles.inline)}>
            <div>
              <label htmlFor="shared-expense">es compartido</label>
              <input
                checked={isShared}
                onChange={() => setIsShared(actual => !actual)}
                type="checkbox"
                id="shared-expense">
              </input>
            </div>
          </div>
        )}
        <button className={styles.submit} type="submit">Aceptar</button>
      </form>
    </Layout>
  )
}
import Head from "next/head";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Layout, { siteTitle } from "../../components/layout";
import styles from './[name].module.scss';
import cn from 'classnames';
import { useState } from "react";
import moment from 'moment'

const ENTRY = 'entry'
const EXPENSE = 'expense'
const today = moment()


function postNewData(data) {
  return fetch('/api/saveItem', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}



export default function Home() {
  const route = useRouter()
  const name = route.query.name
  const [isExpense, setIsExpense] = useState(true);
  const [showIsShared, setShowIsShared] = useState(true);
  const [isShared, setIsShared] = useState(false);
  const [isToday, setIsToday] = useState(true);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [error, setError] = useState(undefined);

  function handleTypeChange(e) {
    setShowIsShared(e.target.id === EXPENSE)
    setIsExpense(e.target.id === EXPENSE)
    setIsShared(false)
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const [{ value: description }, { value }, { checked: isExpense }] =
      Array.from(e.target.elements);
    const type = isExpense ? EXPENSE : ENTRY;

    if (!selectedDate) {
      setError((error) => ({ ...error, date: true }));
      return;
    }

    try {
      await postNewData({
        description,
        value,
        type,
        name,
        selectedDate: selectedDate.toString(),
        ...(type === EXPENSE ? { shared: isShared } : null),
      });
    } catch (e) {
      console.log(e);
    }
  }

  function handleIsTodayChange() {
    setIsToday((actual) => !actual);
    setSelectedDate(undefined);
  }

  function handleDateChange(date) {
    setSelectedDate(moment(date));
    setError((curr) => ({ ...curr, date: undefined }));
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
        <div
          id={styles.isExpenseFilter}
          className={cn(styles.formGroup, styles.inline)}
        >
          <div
            className={cn(
              styles.expenseFilterOption,
              isExpense && styles.active
            )}
          >
            <input
              defaultChecked
              onChange={handleTypeChange}
              type="radio"
              id="expense"
              name="action-type"
              value="expense"
            ></input>
            <label htmlFor="expense">es gasto</label>
          </div>
          <div
            className={cn(
              styles.expenseFilterOption,
              !isExpense && styles.active
            )}
          >
            <input
              onChange={handleTypeChange}
              type="radio"
              id="entry"
              name="action-type"
              value="entry"
            ></input>
            <label htmlFor="entry">es ingreso</label>
          </div>
        </div>
        {showIsShared && (
          <div className={cn(styles.formGroup, styles.inline)}>
            <div>
              <label htmlFor="shared-expense">es compartido?</label>
              <input
                checked={isShared}
                onChange={() => setIsShared((actual) => !actual)}
                type="checkbox"
                id="shared-expense"
              ></input>
            </div>
          </div>
        )}
        <div className={cn(styles.formGroup, styles.flexStart)}>
          <div>
            <label htmlFor="is-today">
              es un {isExpense ? "gasto" : "ingreso"} de hoy?
            </label>
            <input
              checked={isToday}
              onChange={handleIsTodayChange}
              type="checkbox"
              id="is-today"
            ></input>
          </div>
          {!isToday && (
            <div className={styles.dateContainer}>
              <DatePicker
                selected={selectedDate && selectedDate.toDate()}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                id="datepicker"
                placeholderText={`fecha del ${isExpense ? "gasto" : "ingreso"}`}
              />
              {error && error.date && (
                <span className={styles.errorPhrase}>
                  Falta agregar la fecha
                </span>
              )}
            </div>
          )}
        </div>

        <button className={styles.submit} type="submit">
          Aceptar
        </button>
      </form>
    </Layout>
  );
}
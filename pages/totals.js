import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import getSummary from './api/getSummary'

function renderShared(shared) {
  return (
    <div>
      <h3>Gastos Compartido:</h3>
      <p>Leandro Gasto: ${shared.leandroExpent}</p>
      <p>Jazmin Gasto: ${shared.jazminExpent}</p>
      <p>Jazmin Gasto: ${shared.jazminExpent}</p>
      <p>Deudor: {shared.debtor}</p>
      <p>Deuda: ${shared.debtAmmount}</p>
    </div>
  )
}

function renderIndividualExpenses(name, data) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Ingreso: ${data.totalIncome}</p>
      <p>Gasto: ${data.totalExpent}</p>
      <p>Diferencia: ${data.diff}</p>
    </div>
  )
}

export default function Totals({ leandro, jazmin, shared }) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        {renderIndividualExpenses('leandro', leandro)}
        {renderIndividualExpenses('jazmin', jazmin)}
        {renderShared(shared)}
      </section>
    </Layout>
  )
}


export async function getStaticProps(context) {
  const data = await getSummary()
  return {
    props: data, // will be passed to the page component as props
    revalidate: 10
  }
}
import { useRouter } from 'next/router'
import cn from 'classnames';
import styles from './navbar.module.scss';
import Link from 'next/link';

export default function Navbar() {
  const route = useRouter()
  const routeName = route.query?.name
  function isActive(name) {
    return name === routeName || name === route.pathname
  }

  return (
    <nav className={styles.navbar}>
      <ul className={styles.ul}>
        <li className={cn(styles.li, isActive('leandro') && styles.active)}>
          <Link href="/user/leandro">Leandro</Link>
        </li>
        <li className={cn(styles.li, isActive('jazmin') && styles.active)}>
          <Link href="/user/jazmin">Jazmin</Link>
        </li>
        <li className={cn(styles.li, isActive('/totals') && styles.active)}>
          <Link href="/totals">Totals</Link>
        </li>
      </ul>
    </nav>
  )
}

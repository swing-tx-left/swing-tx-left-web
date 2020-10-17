
import styles from './Footer.module.css'

export default function Footer(props) {
	return (
		<footer className={styles.footer}>
			<nav><ul>
				{props.footer.map((el) => {
					return (<li key={el.text + '---------$----------' + el.url}>
						<a  href={el.url} target={el.target} rel={el.target==='_blank'?'noopener noreferrer':null}>
							{el.text}
						</a>
					</li>);
				})}
		</ul></nav>
		</footer>
	)
}

import Link from 'next/link'
import styles from './Header.module.css'
import {useRef, useEffect, useState} from 'react'


export default function Header(props){
	let headerEl=useRef(null);

	const [hamburgerMode,setHamburgerMode]=useState(false);

	const [showHamburger,setShowHamburger]=useState(false);
	useEffect(()=>{
		hamburgerModeSwitcher();
		window.addEventListener('resize',hamburgerModeSwitcher);

		return ()=>{ 
			window.removeEventListener('resize',hamburgerModeSwitcher)
		};
	})

	let hamburgerModeSwitcher=()=>{
		// console.log('resize')
		// console.log(headerEl.current.offsetHeight);
		// console.log(headerEl.current.scrollHeight);

		if(headerEl.current.offsetHeight*1.5<headerEl.current.scrollHeight){
			setHamburgerMode(true);
		}
		else{
			setHamburgerMode(false);
			setShowHamburger(false);
		}
	};


	return (
		<header  ref={headerEl} className={styles.mainHeader}>
			<Link href="[[...pageid]]" as={props.homepage}>
			<a>
					<img className={styles.siteLogo} src={props.logo}/>
				</a>
			</Link>
			{hamburgerMode&&
				(<button aria-label="navigation menu" className={styles.hamburgerButton} onClick={()=>{setShowHamburger(!showHamburger)}}></button>)
			}
			{hamburgerMode&&showHamburger&&
				(<HeaderHamburgerNav nav={props.nav} closeHamNav={()=>{setShowHamburger(false)}}/>)
			}
			<HeaderNavBar nav={props.nav}/>
		</header>
	);
}

function HeaderHamburgerNav(props){
	//investigate if can re use HeaderMainNavBar
	let navArr=[]
	for( let i of props.nav){
		navArr.push(<li key={i.page+'----$-----'+i.text}><Link href="[[...pageid]]" as={'/'+i.page}><a onClick={props.closeHamNav} className={styles.navBarLink}>{i.text}</a></Link></li>)
	}


	return (
		<nav className={styles.hamNav}><ul>
			{navArr}
		</ul></nav>
	)
}


function HeaderNavBar(props){
	let navArr=[]
	for( let i of props.nav){
		navArr.push(<li key={i.page+'----$-----'+i.text}><Link href="[[...pageid]]" as={'/'+i.page}><a className={styles.navBarLink}>{i.text}</a></Link></li>)
	}


	return (<nav className={styles.navBar}><ul>
		{navArr}
	</ul>
		</nav>);
}
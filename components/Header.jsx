import Link from 'next/link'


export default function Header(props){



	return (
		<header>
			<Link href="[[...pageid]]" as={props.homepage}>
				<a>
					<img src={props.logo}/>
				</a>
			</Link>
			<HeaderNavBar nav={props.nav}/>
		</header>
	);
}


function HeaderNavBar(props){
	let navArr=[]
	for( let i of props.nav){
		navArr.push(<li key={i.page+'----$-----'+i.text}><Link href="[[...pageid]]" as={'/'+i.page}><a>{i.text}</a></Link></li>)
	}


	return (<ul>
		{navArr}
	</ul>);
}
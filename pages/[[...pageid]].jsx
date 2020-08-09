import { getProps, getPaths } from '../lib/libPages'
import Header from '../components/Header'
import CSSGlobalVars from '../components/CssVars'
import {ContentBlocks} from '../components/ContentBlock'
import MainImage from '../components/MainImage'
import Head from 'next/head'
export default function Page(props) {


	return (
		<>
			<Head>
				<link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Bungee+Shade&display=swap" rel="stylesheet"/>

				<link href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>

				<link href="https://fonts.googleapis.com/css2?family=Finger+Paint&family=Permanent+Marker&display=swap" rel="stylesheet"/>
			</Head>
			<Header logo={props.siteData.logo} homepage={'/' + props.siteData.home} nav={props.siteData.navigationBar} />
			<MainImage image={props.pageData.mainImage} fullPageImage={props.pageData.mainImageFullPage} buttons={props.pageData.mainButtons} pageMainMessage={props.pageData.pageMainMessage} pageMainMessageShow={props.pageData.pageMainMessageShow}/>
			<main>
				<ContentBlocks eventData={props.eventData} eventDataByDay={props.eventDataByDay} content={props.pageData.content}/>
			</main>
		

			<footer>
				<p>some footer content</p>
				<p>some footer content</p>
				<p>some footer content</p>
				<p>some footer content</p>
				<p>some footer content</p>
				<p>some footer content</p>
				<p>some footer content</p>
			</footer>

			{/* <details><pre>{JSON.stringify(props, null, '\t')}</pre></details> */}
			<CSSGlobalVars/>
			<style global jsx>{`
				html{
					scroll-behavior: smooth;
				}
				
				body{
					margin:0;
					padding:0;
					background-color: var(--site-white);
					display:flex;
					color: var(--site-black);
					flex-direction: column;
					min-height:100vh;
					font-family:sans-serif;
				}

				a{
					color:var(--link-color);
					text-decoration: none;
				}
				a:hover{
					text-decoration: underline;
				}
			`}
			</style>
		</>
	);
}


export async function getStaticPaths() {
	return getPaths();
}

export async function getStaticProps(context) {
	return await getProps(context)
}


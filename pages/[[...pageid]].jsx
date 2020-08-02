import { getProps, getPaths } from '../lib/libPages'
import Header from '../components/Header'
import CSSGlobalVars from '../components/CssVars'
import ContentBlocks from '../components/ContentBlock'
import MainImage from '../components/MainImage'
export default function Page(props) {


	return (
		<>
			<Header logo={props.siteData.logo} homepage={'/' + props.siteData.home} nav={props.siteData.navigationBar} />
			<MainImage image={props.pageData.mainImage} buttons={props.pageData.mainButtons}/>
		
			<main>
				<ContentBlocks content={props.pageData.content}/>
			</main>
			
				
			
			



			<pre>{JSON.stringify(props.pageData, null, '\t')}</pre>
			<CSSGlobalVars/>
			<style global jsx>{`
				body{
					all:unset;
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
	return getProps(context)
}


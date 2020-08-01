export default function CSSGlobalVars(props) {
	return(
	<style global jsx>
		{
			`
	:root{
		/* hsl(195, 86%, 57%)
		#34c1f0
		rgb(52, 193, 240) */
		
		
		--logo-blue-red:52;
		--logo-blue-green:193;
		--logo-blue-blue:240;
		--logo-blue:rgb(var(--logo-blue-red),var(--logo-blue-green),var(--logo-blue-blue));
		
		/* #ef5c68
		rgb(239, 92, 104)
		hsl(355, 82%, 65%) */
		--logo-pink-red:239;
		--logo-pink-green:92;
		--logo-pink-blue:104;
		
		/* --logo-pink:#ED5B67; */
		--logo-pink:rgb(var(--logo-pink-red),var(--logo-pink-green),var(--logo-pink-blue));;
	
	
		
		
		--site-black-red:0;
		--site-black-green:0;
		--site-black-blue:25;
		--site-black:rgb(var(--site-black-red),var(--site-black-green),var(--site-black-blue));
	
		--site-white-red:245;
		--site-white-green:245;
		--site-white-blue:255;
		--site-white:rgb(var(--site-white-red),var( --site-white-green), var(--site-white-blue));
	
		--link-color:#0461F0;
		--link-color-for-logo-pink-background:#0491F0;;
		--link-color-for-logo-pink-background:var(--link-color);
	
	
		--light-blue-red:calc((10 * var(--site-white-red) + var(--logo-blue-red) ) / 11); 
		--light-blue-green:calc((10 * var(--site-white-green) + var(--logo-blue-green) ) / 11); 
		--light-blue-blue:calc((10 * var(--site-white-blue) + var(--logo-blue-blue) ) / 11); 
	
		--light-blue:rgb(var(--light-blue-red),var(--light-blue-green),var(--light-blue-blue));
	
	
		--light-pink-red:calc((10 * var(--site-white-red) + var(--logo-pink-red) ) / 11); 
		--light-pink-green:calc((10 * var(--site-white-green) + var(--logo-pink-green) ) / 11); 
		--light-pink-blue:calc((10 * var(--site-white-blue) + var(--logo-pink-blue) ) / 11); 
	
		--light-pink:rgb(var(--light-pink-red),var(--light-pink-green),var(--light-pink-blue));
	
		--darken-blue-red:calc((0.2 * var(--site-black-red) + var(--logo-blue-red) ) / 1.2); 
		--darken-blue-green:calc((0.2 * var(--site-black-green) + var(--logo-blue-green) ) / 1.2); 
		--darken-blue-blue:calc((0.2 * var(--site-black-blue) + var(--logo-blue-blue) ) / 1.2); 
	
		--darken-blue:rgb(var(--darken-blue-red),var(--darken-blue-green),var(--darken-blue-blue));
	
		
		--logo-mean-red:calc( ( var(--logo-blue-red) + var(--logo-pink-red) ) / 2);
		--logo-mean-green:calc( ( var(--logo-blue-green) + var(--logo-pink-green) ) / 2);
		--logo-mean-blue:calc( ( var(--logo-blue-blue) + var(--logo-pink-blue) ) / 2);
		--logo-mean:rgb(var(--logo-mean-red),var(--logo-mean-green),var(--logo-mean-blue));
	
		--dark-blue-red:calc((1 * var(--site-black-red) + var(--logo-pink-red) ) / 2); 
		--dark-blue-green:calc((0.4 * var(--site-black-green) + var(--logo-blue-green) ) / 1.4); 
		--dark-blue-blue:calc((1 * var(--site-black-blue) + var(--logo-blue-blue) ) / 2); 
	
		--dark-blue:rgb(var(--dark-blue-red),var(--dark-blue-green),var(--dark-blue-blue));
	
	}
	
	`
		}
	</style>);
}

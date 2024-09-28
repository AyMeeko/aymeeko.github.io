const systemInitiatedDark = window.matchMedia("(prefers-color-scheme: dark)");
const theme = sessionStorage.getItem('theme');
const darkTheme = "<i class='fas fa-moon'></i>";
const lightTheme = "<i class='fas fa-sun'></i>";

if (systemInitiatedDark.matches) {
	document.getElementById("theme-toggle").innerHTML = lightTheme;
} else {
	document.getElementById("theme-toggle").innerHTML = darkTheme;
}

function prefersColorTest(systemInitiatedDark) {
  if (systemInitiatedDark.matches) {
  	document.documentElement.setAttribute('data-theme', 'dark');
   	document.getElementById("theme-toggle").innerHTML = lightTheme;
   	sessionStorage.setItem('theme', '');
  } else {
  	document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById("theme-toggle").innerHTML = darkTheme;
    sessionStorage.setItem('theme', '');
  }
}
systemInitiatedDark.addEventListener('change', prefersColorTest);


function modeSwitcher() {
	const theme = sessionStorage.getItem('theme');
	if (theme === "dark") {
		document.documentElement.setAttribute('data-theme', 'light');
		sessionStorage.setItem('theme', 'light');
		document.getElementById("theme-toggle").innerHTML = darkTheme;
	}	else if (theme === "light") {
		document.documentElement.setAttribute('data-theme', 'dark');
		sessionStorage.setItem('theme', 'dark');
		document.getElementById("theme-toggle").innerHTML = lightTheme;
	} else if (systemInitiatedDark.matches) {
		document.documentElement.setAttribute('data-theme', 'light');
		sessionStorage.setItem('theme', 'light');
		document.getElementById("theme-toggle").innerHTML = darkTheme;
	} else {
		document.documentElement.setAttribute('data-theme', 'dark');
		sessionStorage.setItem('theme', 'dark');
		document.getElementById("theme-toggle").innerHTML = lightTheme;
	}
}

if (theme === "dark") {
	document.documentElement.setAttribute('data-theme', 'dark');
	sessionStorage.setItem('theme', 'dark');
	document.getElementById("theme-toggle").innerHTML = lightTheme;
} else if (theme === "light") {
	document.documentElement.setAttribute('data-theme', 'light');
	sessionStorage.setItem('theme', 'light');
	document.getElementById("theme-toggle").innerHTML = darkTheme;
}

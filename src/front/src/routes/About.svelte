<main class="container">

	<section class="hero">
		<h1>SOS2526-13</h1>
		<p>Sistemas Orientados a Servicios — Universidad de Sevilla</p>
		<a href="https://github.com/gti-sos/SOS2526-13" target="_blank">
			Repositorio del grupo
		</a>
		<a href="/analytics">Gráfica grupal</a>
	</section>

	<section class="section">
		<h2>👥 Equipo</h2>

		<div class="grid">

			<div class="card">
				<h3>Pablo Moraleda Álvarez</h3>
				<p>API: conflict-stats</p>

				<div class="links">
					<a href="/conflict-stats">
						Frontend de Pablo Moraleda Alvarez
					</a>

					<a href="/conflict-stats-vue">
						Frontend de Pablo Moraleda Alvarez (Vue)
					</a>
					<p>APIs</p>
					<a href="/api/v2/conflict-stats">API v2</a>
					<a href="/api/v1/conflict-stats">API v1</a>
					<p>Documentación Postman</p>
					<a href="https://documenter.getpostman.com/view/53199914/2sBXijJXMJ">API v2 docs</a>
					<a href="https://documenter.getpostman.com/view/53199914/2sBXigMtL7">API v1 docs</a>
				</div>
			</div>

			<div class="card">
				<h3>Camila España Vildoso</h3>
				<p>API: military-stats</p>

				<div class="links">
					<a href="/military-stats">Frontend Camila España Vildoso</a>
					<p>APIs</p>	
					<a href="/api/v2/military-stats">API v2</a>
					<a href="/api/v1/military-stats">API v1</a>
					<p>Documentación Postman</p>
					<a href="https://documenter.getpostman.com/view/52632390/2sBXiqDTxK">API v2 docs</a>
					<a href="https://documenter.getpostman.com/view/52632390/2sBXigNECE">API v1 docs</a>

					<p>Gráfica</p>
					<a href="/analytics/military-stats">Gráfica propia</a>
				
					<p>Integraciones</p>
					<a href="/analytics/military-stats/global-ev-sales">global-ev-sales</a>
					<a href="/analytics/military-stats/ozone-depleting-substance-consumptions">ozone-depleting-substance-consumptions</a>


				</div>
			</div>

			<div class="card">
				<h3>Claudia Páez Sollo</h3>
				<p>API: exportations-stats</p>

				<div class="links">
					<a href="/exportations-stats">Frontend Claudia Páez Sollo</a>
					<p>APIs</p>
					<a href="/api/v2/exportations-stats">API v2</a>
					<a href="/api/v1/exportations-stats">API v1</a>
					<p>Documentación Postman</p>
					<a href="https://documenter.getpostman.com/view/52406650/2sBXiomVBY">API v2 docs</a>
					<a href="https://documenter.getpostman.com/view/52406650/2sBXigMYhP">API v1 docs</a>

				</div>
			</div>

		</div>
	</section>

</main>

<style>
	:root {
		--bg: #f8fafc;
		--card: #ffffff;
		--text: #0f172a;
		--primary: #2563eb;
		--border: #e2e8f0;
	}

	.container {
		max-width: 1100px;
		margin: auto;
		padding: 2rem;
		font-family: system-ui, sans-serif;
		background: var(--bg);
		color: var(--text);
	}

	.hero {
		text-align: center;
		padding: 2rem;
		background: linear-gradient(135deg, #1e3a8a, #3b82f6);
		color: white;
		border-radius: 12px;
		margin-bottom: 2rem;
	}

	.hero a {
		color: white;
		text-decoration: underline;
	}

	.section {
		margin-top: 2rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}

	.card {
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1rem;
	}

	.card h3 {
		margin-top: 0;
		color: var(--primary);
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	a {
		color: var(--primary);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
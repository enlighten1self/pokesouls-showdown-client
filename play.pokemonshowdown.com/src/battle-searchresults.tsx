/**
 * Search Results
 *
 * Code for displaying sesrch results from battle-dex-search.ts
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */

function getTypeIconStyle(type: string | null | undefined) {
	let num = 0;
	const typeName = type || '???';
	switch (typeName) {
	case '???': num = 0; break;
	case 'Bird': num = 1; break;
	case 'Bug': num = 2; break;
	case 'Dark': num = 3; break;
	case 'Dragon': num = 4; break;
	case 'Electric': num = 5; break;
	case 'Fairy': num = 6; break;
	case 'Fighting': num = 7; break;
	case 'Fire': num = 8; break;
	case 'Flying': num = 9; break;
	case 'Ghost': num = 10; break;
	case 'Grass': num = 11; break;
	case 'Ground': num = 12; break;
	case 'Ice': num = 13; break;
	case 'Normal': num = 14; break;
	case 'Poison': num = 15; break;
	case 'Psychic': num = 16; break;
	case 'Rock': num = 17; break;
	case 'Steel': num = 18; break;
	case 'Stellar': num = 19; break;
	case 'Water': num = 20; break;
	default: num = 0; break;
	}
	const top = Math.floor(num / 12) * 14;
	const left = (num % 12) * 32;
	return `display:inline-block;width:32px;height:14px;vertical-align:text-bottom;background:transparent url(${Dex.resourcePrefix}sprites/typeicon-sheet.png) no-repeat scroll -${left}px -${top}px`;
}

function getCategoryIconStyle(category: string | null | undefined) {
	let num = 0;
	const categoryID = toID(category);
	switch (categoryID) {
	case 'physical': num = 0; break;
	case 'special': num = 1; break;
	case 'status': num = 2; break;
	default: num = 2; break;
	}
	const top = num * 16;
	return `display:inline-block;width:32px;height:14px;vertical-align:text-bottom;background:transparent url(${Dex.resourcePrefix}sprites/catagoryicon-sheet.png) no-repeat scroll 0px -${top}px`;
}

class PSSearchResults extends preact.Component<{search: DexSearch}> {
	readonly URL_ROOT = `//${Config.routes.dex}/`;

	renderPokemonSortRow() {
		const search = this.props.search;
		const sortCol = search.sortCol;
		return <li class="result"><div class="sortrow">
			<button class={`sortcol numsortcol${!sortCol ? ' cur' : ''}`}>{!sortCol ? 'Sort: ' : search.firstPokemonColumn}</button>
			<button class={`sortcol pnamesortcol${sortCol === 'name' ? ' cur' : ''}`} data-sort="name">Name</button>
			<button class={`sortcol typesortcol${sortCol === 'type' ? ' cur' : ''}`} data-sort="type">Types</button>
			<button class={`sortcol abilitysortcol${sortCol === 'ability' ? ' cur' : ''}`} data-sort="ability">Abilities</button>
			<button class={`sortcol statsortcol${sortCol === 'hp' ? ' cur' : ''}`} data-sort="hp">HP</button>
			<button class={`sortcol statsortcol${sortCol === 'atk' ? ' cur' : ''}`} data-sort="atk">Atk</button>
			<button class={`sortcol statsortcol${sortCol === 'def' ? ' cur' : ''}`} data-sort="def">Def</button>
			<button class={`sortcol statsortcol${sortCol === 'spa' ? ' cur' : ''}`} data-sort="spa">SpA</button>
			<button class={`sortcol statsortcol${sortCol === 'spd' ? ' cur' : ''}`} data-sort="spd">SpD</button>
			<button class={`sortcol statsortcol${sortCol === 'spe' ? ' cur' : ''}`} data-sort="spe">Spe</button>
			<button class={`sortcol statsortcol${sortCol === 'bst' ? ' cur' : ''}`} data-sort="bst">BST</button>
		</div></li>;
	}

	renderMoveSortRow() {
		const sortCol = this.props.search.sortCol;
		return <li class="result"><div class="sortrow">
			<button class={`sortcol movenamesortcol${sortCol === 'name' ? ' cur' : ''}`} data-sort="name">Name</button>
			<button class={`sortcol movetypesortcol${sortCol === 'type' ? ' cur' : ''}`} data-sort="type">Type</button>
			<button class={`sortcol movetypesortcol${sortCol === 'category' ? ' cur' : ''}`} data-sort="category">Cat</button>
			<button class={`sortcol powersortcol${sortCol === 'power' ? ' cur' : ''}`} data-sort="power">Pow</button>
			<button class={`sortcol accuracysortcol${sortCol === 'accuracy' ? ' cur' : ''}`} data-sort="accuracy">Acc</button>
			<button class={`sortcol ppsortcol${sortCol === 'pp' ? ' cur' : ''}`} data-sort="pp">PP</button>
		</div></li>;
	}

	renderPokemonRow(id: ID, matchStart: number, matchEnd: number, errorMessage?: preact.ComponentChildren) {
		const search = this.props.search;
		const pokemon = search.dex.species.get(id);
		if (!pokemon) return <li class="result">Unrecognized pokemon</li>;

		let tagStart = (pokemon.forme ? pokemon.name.length - pokemon.forme.length - 1 : 0);

		const stats = pokemon.baseStats;
		let bst = 0;
		for (const stat of Object.values(stats)) bst += stat;
		if (search.dex.gen < 2) bst -= stats['spd'];

		if (errorMessage) {
			return <li class="result"><a href={`${this.URL_ROOT}pokemon/${id}`} data-target="push" data-entry={`pokemon|${pokemon.name}`}>
				<span class="col numcol">{search.getTier(pokemon)}</span>

				<span class="col iconcol">
					<span style={Dex.getPokemonIcon(pokemon.id)}></span>
				</span>

				<span class="col pokemonnamecol">{this.renderName(pokemon.name, matchStart, matchEnd, tagStart)}</span>

				{errorMessage}
			</a></li>;
		}

		return <li class="result"><a href={`${this.URL_ROOT}pokemon/${id}`} data-target="push" data-entry={`pokemon|${pokemon.name}`}>
			<span class="col numcol">{search.getTier(pokemon)}</span>

			<span class="col iconcol">
				<span style={Dex.getPokemonIcon(pokemon.id)}></span>
			</span>

			<span class="col pokemonnamecol">{this.renderName(pokemon.name, matchStart, matchEnd, tagStart)}</span>

			<span class="col typecol">
				{pokemon.types.map(type =>
					<span class="pixelated" style={getTypeIconStyle(type)} title={type} aria-label={type} />
				)}
			</span>

			{search.dex.gen >= 3 && (pokemon.abilities['1'] ?
				<span class="col twoabilitycol">{pokemon.abilities['0']}<br />{pokemon.abilities['1']}</span>
			:
				<span class="col abilitycol">{pokemon.abilities['0']}</span>
			)}
			{search.dex.gen >= 5 && (pokemon.abilities['S'] ?
				<span class={`col twoabilitycol${pokemon.unreleasedHidden ? ' unreleasedhacol' : ''}`}>{pokemon.abilities['H'] || ''}<br />{pokemon.abilities['S']}</span>
			: pokemon.abilities['H'] ?
				<span class={`col abilitycol${pokemon.unreleasedHidden ? ' unreleasedhacol' : ''}`}>{pokemon.abilities['H']}</span>
			:
				<span class="col abilitycol"></span>
			)}

			<span class="col statcol"><em>HP</em><br />{stats.hp}</span>
			<span class="col statcol"><em>Atk</em><br />{stats.atk}</span>
			<span class="col statcol"><em>Def</em><br />{stats.def}</span>
			{search.dex.gen > 2 && <span class="col statcol"><em>SpA</em><br />{stats.spa}</span>}
			{search.dex.gen > 2 && <span class="col statcol"><em>SpD</em><br />{stats.spd}</span>}
			{search.dex.gen < 2 && <span class="col statcol"><em>Spc</em><br />{stats.spa}</span>}
			<span class="col statcol"><em>Spe</em><br />{stats.spe}</span>
			<span class="col bstcol"><em>BST<br />{bst}</em></span>
		</a></li>;
	}

	renderName(name: string, matchStart: number, matchEnd: number, tagStart?: number) {
		if (!matchEnd) {
			if (!tagStart) return name;
			return [
				name.slice(0, tagStart), <small>{name.slice(tagStart)}</small>,
			];
		}

		let output: preact.ComponentChild[];
		if (tagStart && matchStart >= tagStart) {
			output = [name];
		} else {
			output = [
				name.slice(0, matchStart),
				<b>{name.slice(matchStart, matchEnd)}</b>,
				name.slice(matchEnd, tagStart || name.length),
			];
			if (!tagStart) return output;
		}

		if (matchEnd && matchEnd > tagStart) {
			if (matchStart < tagStart) {
				matchStart = tagStart;
			}
			output.push(
				<small>{name.slice(tagStart, matchStart)}<b>{name.slice(matchStart, matchEnd)}</b>{name.slice(matchEnd)}</small>
			);
		} else {
			output.push(<small>{name.slice(tagStart)}</small>);
		}

		return output;
	}

	renderItemRow(id: ID, matchStart: number, matchEnd: number, errorMessage?: preact.ComponentChildren) {
		const search = this.props.search;
		const item = search.dex.items.get(id);
		if (!item) return <li class="result">Unrecognized item</li>;

		return <li class="result"><a href={`${this.URL_ROOT}items/${id}`} data-target="push" data-entry={`item|${item.name}`}>
			<span class="col itemiconcol">
				<span style={Dex.getItemIcon(item)}></span>
			</span>

			<span class="col namecol">{this.renderName(item.name, matchStart, matchEnd)}</span>

			{errorMessage}

			{!errorMessage && <span class="col itemdesccol">{item.shortDesc}</span>}
		</a></li>;
	}

	renderAbilityRow(id: ID, matchStart: number, matchEnd: number, errorMessage?: preact.ComponentChildren) {
		const search = this.props.search;
		const ability = search.dex.abilities.get(id);
		if (!ability) return <li class="result">Unrecognized ability</li>;

		return <li class="result"><a href={`${this.URL_ROOT}abilitys/${id}`} data-target="push" data-entry={`ability|${ability.name}`}>
			<span class="col namecol">{this.renderName(ability.name, matchStart, matchEnd)}</span>

			{errorMessage}

			{!errorMessage && <span class="col abilitydesccol">{ability.shortDesc}</span>}
		</a></li>;
	}

	renderMoveRow(id: ID, matchStart: number, matchEnd: number, errorMessage?: preact.ComponentChildren) {
		const search = this.props.search;
		const move = search.dex.moves.get(id);
		if (!move) return <li class="result">Unrecognized move</li>;

		const tagStart = (move.name.startsWith('Hidden Power') ? 12 : 0);

		if (errorMessage) {
			return <li class="result"><a href={`${this.URL_ROOT}move/${id}`} data-target="push" data-entry={`move|${move.name}`}>
				<span class="col movenamecol">{this.renderName(move.name, matchStart, matchEnd, tagStart)}</span>

				{errorMessage}
			</a></li>;
		}

		// Prefer PP overrides from BattleTeambuilderTable when available (teambuilder-specific overrides)
		let ppBase = move.pp;
		let override = move.ppOverride;
		let pp = 1;

		if (override !== null) {
			pp = override;
		} else {
			pp = (ppBase === 1 || move.noPPBoosts ? ppBase : ppBase * 8 / 5);
		}

		// code continues here
		if (search.dex.gen < 3) pp = Math.min(61, pp);
		return <li class="result"><a href={`${this.URL_ROOT}move/${id}`} data-target="push" data-entry={`move|${move.name}`}>
			<span class="col movenamecol">{this.renderName(move.name, matchStart, matchEnd, tagStart)}</span>

			<span class="col typecol">
				<span class="pixelated" style={getTypeIconStyle(move.type)} title={move.type} aria-label={move.type} />
				<span class="pixelated" style={getCategoryIconStyle(move.category)} title={move.category} aria-label={move.category} />
			</span>

			<span class="col labelcol">
				{move.category !== 'Status' ? [<em>Power</em>, <br />, `${move.basePower}` || '\u2014'] : ''}
			</span>
			<span class="col widelabelcol">
				<em>Accuracy</em><br />{move.accuracy && move.accuracy !== true ? `${move.accuracy}%` : '\u2014'}
			</span>
			<span class="col pplabelcol">
				<em>PP</em><br />{pp}
			</span>

			<span class="col movedesccol">{move.shortDesc}</span>

		</a></li>;
	}

	renderTypeRow(id: ID, matchStart: number, matchEnd: number, errorMessage?: preact.ComponentChildren) {
		const search = this.props.search;
		const name = id.charAt(0).toUpperCase() + id.slice(1);

		return <li class="result"><a href={`${this.URL_ROOT}types/${id}`} data-target="push" data-entry={`type|${name}`}>
			<span class="col namecol">{this.renderName(name, matchStart, matchEnd)}</span>

			<span class="col typecol">
				<span class="pixelated" style={getTypeIconStyle(name)} title={name} aria-label={name} />
			</span>

			{errorMessage}
		</a></li>;
	}

	renderCategoryRow(id: ID, matchStart: number, matchEnd: number, errorMessage?: preact.ComponentChildren) {
		const search = this.props.search;
		const name = id.charAt(0).toUpperCase() + id.slice(1);

		return <li class="result"><a href={`${this.URL_ROOT}categories/${id}`} data-target="push" data-entry={`category|${name}`}>
			<span class="col namecol">{this.renderName(name, matchStart, matchEnd)}</span>

			<span class="col typecol">
				<img src={`${Dex.resourcePrefix}sprites/categories/${name}.png`} alt={name} height="14" width="32" class="pixelated" />
			</span>

			{errorMessage}
		</a></li>;
	}

	renderArticleRow(id: ID, matchStart: number, matchEnd: number, errorMessage?: preact.ComponentChildren) {
		const search = this.props.search;
		const isSearchType = (id === 'pokemon' || id === 'moves');
		const name = (window.BattleArticleTitles && window.BattleArticleTitles[id]) ||
			(id.charAt(0).toUpperCase() + id.substr(1));

		return <li class="result"><a href={`${this.URL_ROOT}articles/${id}`} data-target="push" data-entry={`article|${name}`}>
			<span class="col namecol">{this.renderName(name, matchStart, matchEnd)}</span>

			<span class="col movedesccol">{isSearchType ? "(search type)" : "(article)"}</span>

			{errorMessage}
		</a></li>;
	}

	renderEggGroupRow(id: ID, matchStart: number, matchEnd: number, errorMessage?: preact.ComponentChildren) {
		const search = this.props.search;
		// very hardcode
		let name: string | undefined;
		if (id === 'humanlike') name = 'Human-Like';
		else if (id === 'water1') name = 'Water 1';
		else if (id === 'water2') name = 'Water 2';
		else if (id === 'water3') name = 'Water 3';
		if (name) {
			if (matchEnd > 5) matchEnd++;
		} else {
			name = id.charAt(0).toUpperCase() + id.slice(1);
		}

		return <li class="result"><a href={`${this.URL_ROOT}egggroups/${id}`} data-target="push" data-entry={`egggroup|${name}`}>
			<span class="col namecol">{this.renderName(name, matchStart, matchEnd)}</span>

			<span class="col movedesccol">(egg group)</span>

			{errorMessage}
		</a></li>;
	}

	renderTierRow(id: ID, matchStart: number, matchEnd: number, errorMessage?: preact.ComponentChildren) {
		const search = this.props.search;
		// very hardcode
		const tierTable: {[id: string]: string} = {
			uber: "Uber",
			caplc: "CAP LC",
			capnfe: "CAP NFE",
		};
		const name = tierTable[id] || id.toUpperCase();

		return <li class="result"><a href={`${this.URL_ROOT}tiers/${id}`} data-target="push" data-entry={`tier|${name}`}>
			<span class="col namecol">{this.renderName(name, matchStart, matchEnd)}</span>

			<span class="col movedesccol">(tier)</span>

			{errorMessage}
		</a></li>;
	}

	renderRow(row: SearchRow) {
		const search = this.props.search;
		const [type, id] = row;
		let matchStart = 0;
		let matchEnd = 0;
		if (row.length > 3) {
			matchStart = row[2]!;
			matchEnd = row[3]!;
		}

		let errorMessage: preact.ComponentChild = null;
		let label;
		if ((label = search.filterLabel(type))) { // tslint:disable-line
			errorMessage = <span class="col filtercol"><em>{label}</em></span>;
		} else if ((label = search.illegalLabel(id as ID))) { // tslint:disable-line
			errorMessage = <span class="col illegalcol"><em>{label}</em></span>;
		}

		switch (type) {
		case 'html':
			const sanitizedHTML = id.replace(/</g, '&lt;')
				.replace(/&lt;em>/g, '<em>').replace(/&lt;\/em>/g, '</em>')
				.replace(/&lt;strong>/g, '<strong>').replace(/&lt;\/strong>/g, '</strong>');
			return <li class="result">
				<p dangerouslySetInnerHTML={{__html: sanitizedHTML}}></p>
			</li>;
		case 'header':
			return <li class="result"><h3>{id}</h3></li>;
		case 'sortpokemon':
			return this.renderPokemonSortRow();
		case 'sortmove':
			return this.renderMoveSortRow();
		case 'pokemon':
			return this.renderPokemonRow(id as ID, matchStart, matchEnd, errorMessage);
		case 'move':
			return this.renderMoveRow(id as ID, matchStart, matchEnd, errorMessage);
		case 'item':
			return this.renderItemRow(id as ID, matchStart, matchEnd, errorMessage);
		case 'ability':
			return this.renderAbilityRow(id as ID, matchStart, matchEnd, errorMessage);
		case 'type':
			return this.renderTypeRow(id as ID, matchStart, matchEnd, errorMessage);
		case 'egggroup':
			return this.renderEggGroupRow(id as ID, matchStart, matchEnd, errorMessage);
			case 'tier':
			return this.renderTierRow(id as ID, matchStart, matchEnd, errorMessage);
		case 'category':
			return this.renderCategoryRow(id as ID, matchStart, matchEnd, errorMessage);
		case 'article':
			return this.renderArticleRow(id as ID, matchStart, matchEnd, errorMessage);
		}
		return <li>Error: not found</li>;
	}

	render() {
		const search = this.props.search;
		return <ul class="dexlist">
			{search.filters && <p>
				Filters: {}
				{search.filters.map(([type, name]) =>
					<button class="filter" value={`${type}:${name}`}>
						${name} <i class="fa fa-times-circle"></i>
					</button>
				)}
				{!search.query && <small style="color: #888">(backspace = delete filter)</small>}
			</p>}
			{search.results &&
			// TODO: implement windowing
			// for now, just show first twenty results
			search.results.slice(0, 20).map(result =>
				this.renderRow(result)
			)}
		</ul>;
	}
}

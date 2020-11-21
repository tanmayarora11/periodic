class Display extends PeriodicTableInfoBox
{
	constructor(tableid, infoboxbackgroundid, infoboxid)
	{
		super(infoboxbackgroundid, infoboxid);
        this._tableid = tableid;

		this.AddFilterChangedEventHandler(this._onFilterChanged);

		this._categoryClassMappings =
		{
			"Alkali metal": "alkalimetal",
			"Alkaline earth metal": "alkalineearthmetal",
			"Lanthanide": "lanthanide",
			"Actinide": "actinide",
			"Transition metal": "transitionmetal",
			"Post-transition metal": "posttransitionmetal",
			"Metalloid": "metalloid",
			"Reactive nonmetal": "reactivenonmetal",
			"Noble gas": "noblegas",
			"Unknown": "unknown"
		}

		this._blockClassMappings =
		{
			"s": "sblock",
			"d": "dblock",
			"f": "fblock",
			"p": "pblock"
		}

		this._groupNames =
		{
			1: "Alkali metals",
			2: "Alkaline earth metals ",
			15: "Pnictogens",
			16: "Chalcogens",
			17: "Halo­gens",
			18: "Noble gases"
		};

		this._createCells();
		this._createColumnHeadings();
		this._createRowHeadings();
		this._populate();

		document.getElementById(this._tableid).addEventListener('click', event =>
		{
			let target = event.target;

			if(target.parentElement.classList.contains("elementcell"))
			{
				target = event.target.parentElement;
			}

			if(target.classList.contains("elementcell"))
			{
				this.Show(target.dataset.atomicnumber);
			}
		});
    }


	_onFilterChanged(changed)
	{
		let currentcell = null;

		for(let element of changed)
		{
			currentcell = document.querySelector(`[data-row='${element.row}'][data-column='${element.column}']`);

			currentcell.classList.toggle("elementcellfaded");
		}
	}


	_createCells()
	{
		let table = document.getElementById(this._tableid);

		let currentcell;

		for(let row = 0; row < this.rowcount; row++)
		{
            let newrow = document.createElement('tr');
			table.appendChild(newrow);

			for(let column = 0; column < this.columncount; column++)
			{
                let cell = document.createElement('td');

				cell.setAttribute("data-row", row);
				cell.setAttribute("data-column", column);

                newrow.appendChild(cell);

				currentcell = document.querySelector(`[data-row='${row}'][data-column='${column}']`);
				currentcell.classList.add("cell");
			}
		}
	}


	_createColumnHeadings()
	{
		for(let column = 1; column <= 18; column++)
		{
			let currentcell = document.querySelector(`[data-row='0'][data-column='${column}']`);
			currentcell.innerHTML = `${column}<br /><span class="groupname">${this._groupNames[column] || "&nbsp;"}</span>`;
			currentcell.classList.add("headingcell");
		}
	}


	_createRowHeadings()
	{
		for(let row = 1; row <= 7; row++)
		{
			let currentcell = document.querySelector(`[data-row='${row}'][data-column='0']`);
			currentcell.innerHTML = row;
			currentcell.classList.add("headingcell");
		}
	}


    _populate()
    {
		let currentcell = null;
		let tooltip = "";

		for(let element of this.data)
		{
			currentcell = document.querySelector(`[data-row='${element.row}'][data-column='${element.column}']`);

			currentcell.setAttribute('data-atomicnumber', element.atomicnumber);

			currentcell.innerHTML = `
				${element.name}<br />
				${element.atomicnumber}<br />
				<span class="chemicalsymbol">${element.symbol}</span><br />
				${element.atomicweight}`;

			tooltip = `Name: ${element.name}
					Atomic number: ${element.atomicnumber}
					Chemical symbol: ${element.symbol}
					Category: ${element.category}
					Atomic weight - conventional: ${element.atomicweight}
					Atomic weight - standard: ${element.atomicweightfull}
					Occurrence: ${element.occurrence}
					State of matter: ${element.stateofmatter}
					Group: ${element.group}
					Period: ${element.period}
					Block: ${element.block}`;

			currentcell.setAttribute("title", tooltip.replace(/\t/g, ''));

			currentcell.classList.add("elementcell");
		}

		this.ColorByCategory();
    }


	ColorByCategory()
	{
        for(let element of this.data)
		{
			let currentcell = document.querySelector(`[data-row='${element.row}'][data-column='${element.column}']`);

			for(let v of Object.values(this._blockClassMappings))
			{
				currentcell.classList.remove(v);
			}

			currentcell.classList.add(this._categoryClassMappings[element.category]);
		}
	}


	ColorByBlock()
	{
        for(let element of this.data)
		{
			let currentcell = document.querySelector(`[data-row='${element.row}'][data-column='${element.column}']`);

			for(let v of Object.values(this._categoryClassMappings))
			{
				currentcell.classList.remove(v);
			}

			currentcell.classList.add(this._blockClassMappings[element.block]);
		}
	}
}


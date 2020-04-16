# vscode-dbt-formatter

## Features

Format SQL and Jinja flavored SQL with ease. This extension uses [dbt-formatter](https://github.com/henriblancke/dbt-formatter) to format your dbt models and macros. This extension depends on [vscode-dbt](https://github.com/bastienboutonnet/vscode-dbt).

## Extension Settings

- `dbt-formatter.dialect`: the SQL dialect you want to use (currently only `default` is available)
- `dbt-formatter.upper`: Uppercase all reserved sql words.
- `dbt-formatter.camelCase`: Allow tokens identified as words to be camelcased (handy when using with `lowerWords`)
- `dbt-formatter.lowerWords`: Lowercase all tokens identified as words (think columns, cte names etc, ...)

## Release Notes

### 1.0.0

Initial release of vscode-dbt-formatter

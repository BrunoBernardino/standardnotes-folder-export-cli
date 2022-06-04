# Standard Notes Folder Export CLI - Deno

[![](https://github.com/BrunoBernardino/standardnotes-folder-export-cli/workflows/Run%20Tests/badge.svg)](https://github.com/BrunoBernardino/standardnotes-folder-export-cli/actions?workflow=Run+Tests)
[![](https://shield.deno.dev/x/standardnotes_folder_export)](https://deno.land/x/standardnotes_folder_export)

This is a small and simple CLI script to convert a decrypted Standard Notes
Backup/Export into a structure of `<tag>/<note-title>.<file-extension>`.

Standard Note's Backup/Export tool exports a single `.txt` file in JSON format,
and all notes in a single directory, which isn't very portable. This script
requires that file to exist in the same directory. It should be called
`Standard Notes Backup and Import File.txt` (default name).

No data ever leaves your device with this.

## Requirements

This was tested with `deno@1.22.0`, though it's possible older versions might
work.

There are no other dependencies. **Deno**!

## Usage (no install)

```sh
# For exporting notes as *.txt files into an "exports" directory
$ deno run --allow-read --allow-write https://deno.land/x/standardnotes_folder_export@1.0.0/main.ts

# For exporting notes as *.md files into an "exported" directory
$ deno run --allow-read --allow-write https://deno.land/x/standardnotes_folder_export@1.0.0/main.ts --file-extension=md --output-directory=exported
```

## Usage (install)

```sh
$ deno install --allow-net https://deno.land/x/standardnotes_folder_export@1.0.0/main.ts --name standardnotes-folder-export

# For exporting notes as *.txt files into an "exports" directory
$ standardnotes-folder-export

# For exporting notes as *.md files into an "exported" directory
$ standardnotes-folder-export --file-extension=md --output-directory=exported
```

## Development

```sh
# For exporting notes as *.txt files into an "exports" directory
$ make start

# For exporting notes as *.md files into an "exported" directory
$ deno run --allow-read --allow-write main.ts --file-extension=md --output-directory=exported

# format
$ make format

# test
$ make test
```

## Deployment

```sh
$ git tag -s 1.0.x
$ git push origin --tags
```

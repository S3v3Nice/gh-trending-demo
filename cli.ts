#!/usr/bin/env ts-node

import {Command} from 'commander'
import axios from 'axios'
import * as readline from 'node:readline'
import {Key} from 'node:readline'
import CliTable3 from 'cli-table3'

const program = new Command()
const API_URL = process.env.API_URL || 'http://localhost:3000/api/repositories'

async function handleRequest(requestFn: () => Promise<any>) {
    try {
        const response = await requestFn()
        return response.data;
    } catch (error) {
        let errorMessage: string

        if (axios.isAxiosError(error) && error.response) {
            errorMessage = error.response.data?.message || error.message
        } else if (error instanceof Error) {
            errorMessage = error.message
        } else {
            errorMessage = String(error)
        }

        console.error(`Error: ${errorMessage}`)
        process.exit(1)
    }
}

function isValidRepositoryName(input: string) {
    return /^([\w-]+)\/([\w.-]+)$/.test(input)
}

program
    .command('list')
    .description('get all trending repositories')
    .action(async () => {
        const pageSize = 10;
        const repositories = await handleRequest(() => axios.get(`${API_URL}`));

        if (repositories.length === 0) {
            console.log('Repositories not found.');
            return;
        }

        let page = 0;
        const totalPages = Math.ceil(repositories.length / pageSize);

        function showPage() {
            console.clear();
            console.log(`Page ${page + 1}/${totalPages}`);

            const table = new CliTable3({
                head: ['#', 'Repo', 'Stars', 'Updated'],
                colWidths: [6, 40, 10, 20],
                wordWrap: true,
            });

            const start = page * pageSize;
            const end = start + pageSize;

            repositories.slice(start, end).forEach((repo: any, index: number) => {
                table.push([
                    start + index + 1,
                    `${repo.owner_name}/${repo.name}`,
                    repo.stars_count.toLocaleString(),
                    new Date(repo.updated_at).toISOString().split('T')[0]
                ]);
            });

            console.log(table.toString());
            console.log(`<- previous | -> next | q - exit`);
        }

        showPage();

        process.stdin.setRawMode(true);
        readline.emitKeypressEvents(process.stdin);

        process.stdin.on('keypress', (_str, key: Key) => {
            if (key.name === 'right' && page < totalPages - 1) {
                page++;
                showPage();
            } else if (key.name === 'left' && page > 0) {
                page--;
                showPage();
            } else if (key.name === 'q') {
                console.clear();
                process.stdin.setRawMode(false);
                process.stdin.pause();
            }
        });
    })

program
    .command('get <id-or-name>')
    .description('get repository by ID or name (i.e. sindresorhus/awesome)')
    .action(async (idOrName) => {
        if (!isNaN(idOrName) || isValidRepositoryName(idOrName)) {
            const data = await handleRequest(() => axios.get(`${API_URL}/${idOrName}`))
            if (data === null) {
                console.error('Could not find such repository.')
            } else {
                const output = [
                    `Id:\t\t${data['id']}`,
                    `Name:\t\t${data['name']}`,
                    `Owner:\t\t${data['owner_name']}`,
                    `Description:\t${data['description']}`,
                    `Stars:\t\t${data['stars_count'].toLocaleString()}`,
                    `Created at:\t${new Date(data['created_at']).toLocaleString()}`,
                    `Updated at:\t${new Date(data['updated_at']).toLocaleString()}`,
                    `Pushed at:\t${new Date(data['pushed_at']).toLocaleString()}`
                ].join("\n");
                console.log(output)
            }
        } else {
            console.error('Error: Incorrect format. Enter a numeric ID or full name (i.e. sindresorhus/awesome)')
            process.exit(1)
        }
    })

program
    .command('sync')
    .description('force sync repositories with GitHub')
    .action(async () => {
        const data = await handleRequest(() => axios.post(`${API_URL}/sync`))
        if (data['success']) {
            console.log('Successfully synced repositories with GitHub!');
        } else {
            console.error(`Error: ${data['error']}`);
        }
    })

program.parse(process.argv)

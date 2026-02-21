import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function htmlPartials() {
    return {
        name: 'html-partials',
        handleHotUpdate({ file, server }) {
            if (file.endsWith('.html')) {
                server.ws.send({ type: 'full-reload' });
            }
        },
        transformIndexHtml(html) {
            return html.replace(/<include src="([^"]+)"><\/include>/g, (match, src) => {
                const filePath = path.resolve(__dirname, src);
                if (fs.existsSync(filePath)) {
                    return fs.readFileSync(filePath, 'utf-8');
                }
                return match;
            });
        }
    };
}

export default defineConfig({
    plugins: [htmlPartials()]
});

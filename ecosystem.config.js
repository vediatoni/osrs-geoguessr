module.exports = {
    apps: [
        {
            name: "rslocator-production",
            script: "/home/equal/rslocator-production/rslocator/server.ts",
            max_memory_restart: '500M',
            error_file: '/home/equal/rslocator-production/logs/err.log',
            out_file: '/home/equal/rslocator-production/logs/out.log',
            log_file: '/home/equal/rslocator-production/logs/combined.log',
            time: true,
            interpreter: "/home/equal/.deno/bin/deno",
            interpreterArgs: "run -A --unstable",
            args: "3000"
        },
        {
            name: "rslocator-testing",
            script: "/home/equal/rslocator-testing/rslocator/server.ts",
            max_memory_restart: '150M',
            error_file: '/home/equal/rslocator-testing/logs/err.log',
            out_file: '/home/equal/rslocator-testing/logs/out.log',
            log_file: '/home/equal/rslocator-testing/logs/combined.log',
            time: true,
            interpreter: "/home/equal/.deno/bin/deno",
            interpreterArgs: "run -A --unstable",   
            args: "3001"    
        },
        {
            name: "rslocator-development",
            script: "/home/equal/rslocator-development/rslocator/server.ts",
            max_memory_restart: '150M',
            error_file: '/home/equal/rslocator-development/logs/err.log',
            out_file: '/home/equal/rslocator-development/logs/out.log',
            log_file: '/home/equal/rslocator-development/logs/combined.log',
            time: true,
            interpreter: "/home/equal/.deno/bin/deno",
            interpreterArgs: "run -A --unstable",   
            args: "3002"    
        }
    ],
};
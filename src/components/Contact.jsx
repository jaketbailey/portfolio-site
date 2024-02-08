export default function Contact() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-1/2">
                <h2 className="pt-8 pb-2 text-3xl font-bold underline">Contact</h2>
                <div className="flex items-center space-x-2">
                    <a
                        href="mailto:hello@contact.jaketbailey.co.uk"
                        className="text-blue-500 dark:text-purple-300 hover:underline underline-offset-2 decoration-2 decoration-blue-400 dark:decoration-purple-500"
                        rel="noreferrer noopener"
                        >
                        Email Me!
                    </a>
                </div>
            </div>
        </div>
    )
}
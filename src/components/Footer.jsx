import Socials from './Socials'

export default function Footer() {
    return (
        <div className="py-5 text-center">
            <div className="container max-w-screen-lg mx-auto">
                <div className="flex flex-wrap justify-center gap-2">
                    <Socials />
                </div>
            </div>
            <p className="text-sm mt-3">
                Say hello at{' '}
                <a
                    href="mailto:hello@contact.jaketbailey.co.uk"
                    className="text-link hover:underline underline-offset-2 decoration-2 decoration-accent"
                >
                    hello@contact.jaketbailey.co.uk
                </a>
            </p>
            <p className="text-sm mt-2 text-muted">
                &copy; {new Date().getFullYear()} Jake Bailey. All rights
                reserved.
            </p>
        </div>
    )
}

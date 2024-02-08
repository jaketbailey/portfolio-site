import Socials from "./Socials";

export default function Footer({ theme }) {
    return (
		<div className="py-5 text-center">
				<div className="container max-w-screen-lg mx-auto">
					<div>
						<div className="flex flex-wrap justify-center gap-2">
							<Socials theme={theme} />
						</div>
					</div>
				</div>
			<p className="text-sm mt-2  opacity-50">
				&copy; {new Date().getFullYear()} Jake Bailey. All rights reserved.
			</p>
		</div>
	);

}
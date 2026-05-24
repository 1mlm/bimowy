export default function Fraction({
	numerator,
	denominator
}: {
	numerator: number;
	denominator: number;
}) {
	return (
		<span className="inline-flex flex-col items-center text-[1em] font-medium leading-none align-middle mx-1">
			<span className="leading-tight">{numerator}</span>
			<span className="w-full border-t border-current my-0.5" />
			<span className="leading-tight">{denominator}</span>
		</span>
	);
}

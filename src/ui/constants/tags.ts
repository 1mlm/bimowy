import {
	AtomIcon,
	BoxIcon,
	BracesIcon,
	CalculatorIcon,
	CpuIcon,
	CrossIcon,
	DiffIcon,
	EarthIcon,
	KeyRoundIcon,
	LandmarkIcon,
	type LucideIcon,
	RulerIcon,
	SplitIcon,
	SquareIcon,
	ThumbsUpIcon,
	VariableIcon,
	WormIcon
} from "lucide-react";

export const TAGS_ICON_MAP: { [key: string]: { icon: LucideIcon } } = {
	math: { icon: CalculatorIcon },
	arithmetic: { icon: DiffIcon },
	logic: { icon: SplitIcon },
	cs: { icon: CpuIcon },
	oop: { icon: BracesIcon },
	python: { icon: WormIcon },
	crypto: { icon: KeyRoundIcon },
	"2d": { icon: SquareIcon },
	"3d": { icon: BoxIcon },
	politics: { icon: EarthIcon },
	us: { icon: LandmarkIcon },
	morality: { icon: ThumbsUpIcon },
	health: { icon: CrossIcon },
	physics: { icon: AtomIcon },
	algebra: { icon: VariableIcon },
	geometry: { icon: RulerIcon }
};

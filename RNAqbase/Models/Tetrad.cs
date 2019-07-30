﻿
using System.Linq;

namespace RNAqbase.Models
{
	public class Tetrad : BaseEntity
	{
		public int Id { get; set; }
		public int QuadruplexId { get; set; }
		public string PdbId { get; set; }
		public int AssemblyId { get; set; }
		public string Molecule { get; set; }
		public string Sequence { get; set; }
		public string OnzClass { get; set; }
		public string Strands { get; set; }
		public int NumberOfStrands => Strands.Distinct().Count();
		public string PdbVisualization { get; set; }
		public string Experiment { get; set; }
	}
}

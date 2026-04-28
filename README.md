# schdlr-solver

**schdlr-solver** is the computational engine behind the `schdlr` project, dedicated to solving the academic timetabling problem.

This library models the static academic schedule as an **Interval Graph**, leveraging **List Coloring** and **Constraint Satisfaction Problem (CSP)** techniques to allocate professors and subjects to class timeslots, strictly adhering to institutional rules (such as the minimum inter-shift rest period).

## Formal Modeling

The problem is abstracted using graph theory as follows:

### 1. Graph Elements $G = (V, E)$

* **Vertices ($V$):** Represent the pre-defined timeslots for each class.
  $$V = \{ s_u \mid \forall u \in T, \forall s \in S_u \}$$
  Where $T$ is the set of classes and $S_u$ is the set of available timeslots for class $u$.

* **Edges ($E$):** Represent conflicts or constraints. An edge exists if the timeslots overlap or if they violate an injected business rule (e.g., inter-shift rest violation).
  $$E = \{ (v_i, v_j) \mid I(v_i, v_j) = 1 \lor R(v_i, v_j) = 1 \}$$
  Where $I$ is the continuous time intersection function, and $R$ is the injected rule violation function.

* **Colors ($C$):** The "colors" applied to the vertices are the **Allocations**, defined as the pair `(Subject, Professor)`. The core rule is: $\forall (v_i, v_j) \in E \implies C(v_i) \neq C(v_j)$.

### 2. Capacitated Vertex Coloring (Exact Demand Constraint)

Unlike traditional graph coloring algorithms that aim to minimize the total number of colors, `schdlr-solver` operates with a strict quota $k$. For a professor $p$ teaching a class $u$:
$$|\{v \in S_u \mid C(v) = p\}| = k(p, u)$$
The resolution engine dynamically tracks this quota, ensuring that colors (professors) only fill the exact number of slots defined by the subject's workload.

## Architecture Pipeline

The graph construction and resolution process happens in three isolated phases, ensuring flexibility and highly testable code:

1. **Phase 1 (Physical Base):** Strict calculation of continuous time intersections. It generates isolated connected components for each day of the week.

2. **Phase 2 (Chained Graphs):** Injection of inter-day constraints. Connects the isolated daily graphs by linking late-night slots (e.g., 20:00) to early-morning slots of the next day (e.g., 07:00), generating logistical inter-shift constraints.

3. **Phase 3 (Domain Restrictions):** Color palette pre-filtering. For instance, if Professor X does not work on Wednesdays, that "color" is mathematically removed from the domain of all Wednesday vertices.

## Roadmap

| Milestone | Task | Status |
|-----------|------|--------|
| **1 — Foundation & Domain Modeling** | Initialize Node.js project with TypeScript, Vitest, and ESLint/Prettier | Done |
| | Configure `release-it` with conventional changelog for versioning and npm publishing | Done |
| | Define core domain interfaces (`Professor`, `Subject`, `Slot`, `Allocation`) | Done |
| | Define graph structures (`Vertex`, `Edge`, `ScheduleGraph`) | Done |
| | Utility functions for time conversion (e.g. parsing `"HH:mm"` to continuous minutes) | Done |
| | Utility functions for importing data from text files or input arguments | ⬜ |
| **2 — Phase 1: Core Topology** | Implement the time intersection function $I(s_i, s_j)$ to detect overlapping slots | ⬜ |
| | Build the base Graph Generator — isolated connected components per weekday | ⬜ |
| | Unit tests: validate adjacency matrix (edges only on time conflicts) | ⬜ |
| **3 — Phase 2 & 3: Constraint Injectors** | **Domain Restriction Injector**: filter color palette by professor's allowed working days | ⬜ |
| | **Inter-shift Constraint Injector**: cross-day edges to enforce the 11-hour rest period | ⬜ |
| | Unit tests: dummy edges correctly link $D$ (night) → $D+1$ (morning) | ⬜ |
| **4 — Solver Engine** | Global State manager: track exact demand quota ($k$ slots) per professor/subject | ⬜ |
| | Core **List Coloring Backtracking** algorithm | ⬜ |
| | Chronological traversal (Monday → Friday) sharing global quota state | ⬜ |
| | **Partial Delivery (Max-CSP)** fallback for unresolved slots at iteration limit | ⬜ |
| **5 — Refinement & Delivery** | Heuristic adjacency bonus (Soft Constraint) to favor contiguous double lessons | ⬜ |
| | CI/CD via GitHub Actions — run Vitest on every PR | ⬜ |
| | Configure `tsc` build and `index.ts` exports for integration with `schdlr` | ⬜ |
| | Publish to npm or internal registry | ⬜ |
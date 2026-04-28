export type EdgeType = 'conflict' | 'preference' | 'inter-day'

export interface Vertex {
  id: number
  cohortId: number
  slotId: number
  allocationId?: number | undefined // Representing the color of the vertex
}

export interface Edge {
  u: Vertex
  v: Vertex
  type: EdgeType
}

/**
 * A graph representing the schedule constraints and preferences.
 */
export class ScheduleGraph {
  // Properties
  vertices: Map<number, Vertex>
  edges: Edge[]
  adjacencyList: Record<number, number[]>

  // Constructor
  constructor() {
    this.vertices = new Map<number, Vertex>()
    this.edges = []
    this.adjacencyList = {}
  }

  // --- Vertices ---

  hasVertex(id: number): boolean {
    return this.vertices.has(id)
  }

  addVertex({ id, cohortId, slotId, allocationId = undefined }: Vertex): void {
    if (this.vertices.has(id)) throw new Error(`Vertex with id ${id} already exists.`)

    this.adjacencyList[id] = []
    this.vertices.set(id, { id, cohortId, slotId, allocationId } satisfies Vertex)
  }

  // --- Edges ---

  hasEdge(uId: number, vId: number): boolean {
    return this.edges.some(
      (edge) =>
        (edge.u.id === uId && edge.v.id === vId) || (edge.u.id === vId && edge.v.id === uId),
    )
  }

  addEdge(uId: number, vId: number, type: EdgeType = 'conflict'): void {
    const u = this.vertices.get(uId)
    if (!u) throw new Error(`Vertex with id ${uId} does not exist.`)

    const v = this.vertices.get(vId)
    if (!v) throw new Error(`Vertex with id ${vId} does not exist.`)

    this.edges.push({ u, v, type })
    this.adjacencyList[uId]!.push(vId)
    this.adjacencyList[vId]!.push(uId)
  }

  // --- Neighbors ---

  getNeighbors(vertexId: number): number[] {
    return this.adjacencyList[vertexId] ?? []
  }

  // --- Coloring ---

  getAllocationId(vertexId: number): number | undefined {
    const vertex = this.vertices.get(vertexId)
    if (!vertex) throw new Error(`Vertex with id ${vertexId} does not exist.`)

    return vertex.allocationId
  }

  setAllocationId(vertexId: number, allocationId: number): void {
    const vertex = this.vertices.get(vertexId)
    if (!vertex) throw new Error(`Vertex with id ${vertexId} does not exist.`)

    vertex.allocationId = allocationId
  }

  // --- State ---

  getUncoloredVertices(): Vertex[] {
    return Array.from(this.vertices.values()).filter((v) => v.allocationId === undefined)
  }

  isComplete(): boolean {
    return Array.from(this.vertices.values()).every((v) => v.allocationId !== undefined)
  }
}

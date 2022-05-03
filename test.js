/*
Q) Parking System: In this exercise, we will design an in memory software for a parking system using object oriented programming.
Overview:
A parking system consists of n floors, and each floor has m parking spots.
To enter the premise, driver can press a button which issues a parking ticket. 
NOTE: No spot is assigned at the time of issuing the ticket.To exit the premise, 
driver can enter his ticket and press a button to exit.
Feature:
At entrance, driver can see floor wise availability on signage board: As an example:
Floor 1 has 5 out of 30 availableFloor 2 has 20 out of 30 available
At the time of exit, driver can see parking charges associated with the ticket.
*/

class Parking {
  constructor(n, m) {
    this.floors = n
    this.spots = []
    for (let i of n) {
      for (let j of m) {
        this.spots[i][j] = { st: null, occ: 0 } // available
      }
    }
  }

  displayAvailableSpots = () => {
    // console.log(this.spots);
    let current = 0
    for (let floor in this.spots) {
      current = 0
      for (let spot in floor) {
        if (this.spots[floor][spot] === 0) {
          current++
        }
      }
      console.log(
        `Floor ${floor + 1} has ${current} out of ${
          this.spots[0].length
        } available`
      )
    }
  }

  assignSpot(floor, spot) {
    this.spots[floor][spot] = 1
  }

  exit(floor, spot) {
    this.spots[floor][spot] = 0
  }
}

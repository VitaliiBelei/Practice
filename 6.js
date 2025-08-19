class Car {
    constructor(brand, year) {
        this.brand = brand;
        this.year = year;
    }
    getAge() {
        const thisYear = new Date().getFullYear();
        const age = thisYear - this.year;
        return age;
    }
    info() {
        return this.brand + " - " + this.getAge() + " років";
    }
}

class ElectricCar extends Car {
    constructor (brand, year, battery) {
        super(brand, year)
        this.battery = battery;
    }
    info() {
        return super.info() + ", батарея " + this.battery + "kWh";
    }
}
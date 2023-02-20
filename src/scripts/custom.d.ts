declare global { 
    namespace NodeJS { 
        interface Global { 
            Config: unknown
        }
    }
}
export default global;

def contains_script_tag(string):
    if '<' in string or '>' in string:
        return True
    return False
